import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../app";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { prisma } from "./document.repository";

describe("POST /api/v1/documents", () => {
  it("should create a new document successfully for an authenticated user", async () => {
    // 1. Arrange: Create a mock JWT token for an authenticated user
    const userPayload = {
      id: "user-cuid-from-hpc-user",
      role: "teacher",
      isAdmin: false,
    };
    const token = jwt.sign(userPayload, config.jwtSecret!);

    const newDocumentData = {
      serialNumber: "2025/CV-TEST",
      title: "Test Document",
      contentSummary: "This is a test summary.",
      type: "INCOMING",
    };

    // 2. Act: Send a request to the endpoint
    const response = await request(app)
      .post("/api/v1/documents")
      .set("Authorization", `Bearer ${token}`)
      .send(newDocumentData);

    // 3. Assert: Check the response
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe(newDocumentData.title);
    expect(response.body.authorId).toBe(userPayload.id);
    expect(response.body.contentSummary).toBe(newDocumentData.contentSummary);
  });

  it("should return 401 Unauthorized if no token is provided", async () => {
    const response = await request(app).post("/api/v1/documents").send({});

    expect(response.status).toBe(401);
  });

  it("should return 400 Bad Request if data is invalid", async () => {
    const userPayload = {
      id: "user-cuid-123",
      role: "teacher",
      isAdmin: false,
    };
    const token = jwt.sign(userPayload, config.jwtSecret!);

    const response = await request(app)
      .post("/api/v1/documents")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Only a title" }); // Missing required fields

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });

  it('should return 404 Forbidden if a user with "student" role tries to create a document', async () => {
    // 1. Arrange: Create token for a user with "student" role
    const studentPayload = { id: "student-user-id", role: "student" };
    const token = jwt.sign(studentPayload, config.jwtSecret!);

    const newDocumentData = {
      serialNumber: "2025/CV-STUDENT",
      title: "Student Document",
      contentSummary: "This shoudn't be created",
      type: "INCOMING",
    };

    const response = await request(app)
      .post("/api/v1/documents")
      .set("Authorization", `Bearer ${token}`)
      .send(newDocumentData);

    // 3. Assert: Expect the server to forbid the action
    expect(response.status).toBe(403);
  });
});

describe("GET /api/v1/documents/:id", () => {
  it("should retrieve a specific document successfully", async () => {
    // 1. Arrange: Create a document directly in the test db
    const userPayload = {
      id: "user-id-for-get-test",
      role: "teacher",
      isAdmin: false,
    };
    const token = jwt.sign(userPayload, config.jwtSecret!);

    const createdDocument = await prisma.document.create({
      data: {
        serialNumber: "GET-TEST-001",
        title: "Document to be fetched",
        contentSummary: "This is a test summary.",
        type: "OUTGOING",
        authorId: userPayload.id,
      },
    });

    // 2. Act: Make a request to the API to get that document
    const response = await request(app)
      .get(`/api/v1/documents/${createdDocument.id}`)
      .set("Authorization", `Bearer ${token}`);

    // 3. Assert: Check the response
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdDocument.id);
    expect(response.body.title).toBe("Document to be fetched");
  });

  it("should return 404 Not Found for non existent document ID", async () => {
    // Arrange
    const userPayload = {
      id: "user-id-for-404-test",
      role: "teacher",
      isAdmin: false,
    };
    const token = jwt.sign(userPayload, config.jwtSecret!);
    const nonExistentId = "cl63x8y7z0000a4b0d1e2f3g4";

    // Act
    const response = await request(app)
      .get(`/api/v1/documents/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Document not found");
  });
});

describe("PUT /api/v1/documents/:id", () => {
  it("should allow author to update their own document", async () => {
    // Arrange
    const userPayload = {
      id: "author-user-id",
      role: "teacher",
      isAdmin: false,
    };
    const token = jwt.sign(userPayload, config.jwtSecret!);

    const document = await prisma.document.create({
      data: {
        serialNumber: "PUT-001",
        title: "Original Title",
        contentSummary: "Original Summary",
        type: "OUTGOING",
        authorId: userPayload.id,
      },
    });

    const updateData = {
      title: "Updated Title",
      contentSummary: "Updated Summary",
      type: "OUTGOING",
      serialNumber: "PUT-001",
    };

    // Act
    const response = await request(app)
      .put(`/api/v1/documents/${document.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updateData);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updateData.title);
  });

  it("should return 403 Forbidden if a user tries to update a document they do not own", async () => {
    // Arrange
    const ownerPayload = {
      id: "owner-user-id",
      role: "teacher",
      isAdmin: false,
    };
    const attackerPayload = {
      id: "attacker-user-id",
      role: "teacher",
      isAdmin: false,
    };
    const attackerToken = jwt.sign(attackerPayload, config.jwtSecret!);

    const document = await prisma.document.create({
      data: {
        serialNumber: "PUT-002",
        title: "Secret Document",
        contentSummary: "Secret Summary",
        type: "OUTGOING",
        authorId: ownerPayload.id,
      },
    });

    const updateData = {
      title: "Hacked Titlte",
      contentSummary: "Hacked Summary",
      type: "INCOMING",
      serialNumber: "PUT-002",
    };

    // Act
    const response = await request(app)
      .put(`/api/v1/documents/${document.id}`)
      .set("Authorization", `Bearer ${attackerToken}`)
      .send(updateData);

    // Assert
    expect(response.status).toBe(403);
  });
});

describe("DELETE /api/v1/documents/:id", () => {
  it("should allow an admin to delete any document", async () => {
    // Arrange
    const adminPayload = {
      id: "admin-user-id",
      role: "teacher",
      isAdmin: true,
    };
    const adminToken = jwt.sign(adminPayload, config.jwtSecret!);

    const document = await prisma.document.create({
      data: {
        serialNumber: "DEL-001",
        title: "Document to be deleted",
        contentSummary: "This document shall be deleted",
        type: "INCOMING",
        authorId: "some-other-user-id",
      },
    });

    // Act
    const response = await request(app)
      .delete(`/api/v1/documents/${document.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    // Assert
    expect(response.status).toBe(204); // 204 No Content is standard for successful delete

    const foundDocument = await prisma.document.findUnique({
      where: { id: document.id },
    });

    expect(foundDocument).toBeNull();
  });

  it("should return 403 Forbidden if a non-admin user tries to delete a document", async () => {
    // Arrange
    const teacherPayLoad = {
      id: "teacher-user-id",
      role: "teacher",
      isAdmin: false,
    };
    const teacherToken = jwt.sign(teacherPayLoad, config.jwtSecret!);

    const document = await prisma.document.create({
      data: {
        serialNumber: "DEL-002",
        title: "Protected Document",
        contentSummary: "This document shoudln't be deleted by teacher",
        type: "OUTGOING",
        authorId: "another-user-id",
      },
    });

    // Act
    const response = await request(app)
      .delete(`/api/v1/documents/${document.id}`)
      .set("Authorization", `Bearer ${teacherToken}`);

    // Assert
    expect(response.status).toBe(403);
  });
});

describe("POST /api/v1/documents/:id/actions", () => {
  it("should allow the author to submit a DRAFT document for approval", async () => {
    // Arrange
    const authorPayload = {
      id: "author-user-id",
      role: "teacher",
      isAdmin: false,
    };
    const approverId = "clx5mzp0w0000a4b0d1e2f3g4";
    const token = jwt.sign(authorPayload, config.jwtSecret!);

    const document = await prisma.document.create({
      data: {
        serialNumber: "ACTION-001",
        title: "Action Test Doc",
        contentSummary: "Summary",
        type: "OUTGOING",
        authorId: authorPayload.id,
        status: "DRAFT",
      },
    });

    const actionPayload = {
      action: "SUBMIT_FOR_APPROVAL",
      assigneeId: approverId,
      comment: "Please review.",
    };

    // Act
    const response = await request(app)
      .post(`/api/v1/documents/${document.id}/actions`)
      .set("Authorization", `Bearer ${token}`)
      .send(actionPayload);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("PENDING_APPROVAL");
    expect(response.body.assigneeId).toBe(approverId);
  });

  it("should allow an assinged user to APPROVE a document", async () => {
    // Arrange
    const approverPayload = {
      id: "approver-user-id",
      role: "teacher",
      isAdmin: true,
    };
    const token = jwt.sign(approverPayload, config.jwtSecret!);

    const document = await prisma.document.create({
      data: {
        serialNumber: "ACTION-002",
        title: "To be Approved",
        contentSummary: "Sumary",
        type: "INCOMING",
        authorId: "another-author",
        status: "PENDING_APPROVAL",
        assigneeId: approverPayload.id,
      },
    });

    // Act
    const response = await request(app)
      .post(`/api/v1/documents/${document.id}/actions`)
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "APPROVE", comment: "Approved" });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("APPROVED");
  });

  it("should return 400 for an invalid state transistion (e.g., approving a DRAFT", async () => {
    const userPayload = {
      id: "some-user-id",
      role: "teacher",
      isAdmin: false,
    };
    const token = jwt.sign(userPayload, config.jwtSecret!);

    const document = await prisma.document.create({
      data: {
        serialNumber: "ACTION-003",
        title: "Document Fail Transist",
        contentSummary: "This document transistion shall fail",
        type: "INCOMING",
        authorId: "author-user-id",
        status: "DRAFT",
      },
    });

    // Act
    const response = await request(app)
      .post(`/api/v1/documents/${document.id}/actions`)
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "APPROVE" });

    // Assert
    expect(response.status).toBe(400);
  });

  it("should allow an assigned user to REJECT a document", async () => {
    // Arrange
    const approverPayload = {
      id: "approver-user-id",
      role: "teacher",
      isAdmin: true,
    };
    const token = jwt.sign(approverPayload, config.jwtSecret!);

    const document = await prisma.document.create({
      data: {
        serialNumber: "ACTION-004",
        title: "To Be Rejcted",
        contentSummary: "Summary",
        type: "INCOMING",
        authorId: "another-author",
        status: "PENDING_APPROVAL",
        assigneeId: approverPayload.id,
      },
    });

    // Act
    const response = await request(app)
      .post(`/api/v1/documents/${document.id}/actions`)
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "REJECT", comment: "Needs revisions" });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("REJECTED");
    expect(response.body.assigneeId).toBeNull();
  });

  it("should allow the author to ISSUE an approved document", async () => {
    // Arrange
    const authorPayload = {
      id: "author-user-id",
      role: "teacher",
      isAdmin: false,
    };
    const token = jwt.sign(authorPayload, config.jwtSecret!);

    const document = await prisma.document.create({
      data: {
        serialNumber: "ACTION-005",
        title: "To Be Issued",
        contentSummary: "Summary",
        type: "OUTGOING",
        authorId: authorPayload.id,
        status: "APPROVED",
      },
    });

    // Act
    const response = await request(app)
      .post(`/api/v1/documents/${document.id}/actions`)
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "ISSUE", comment: "Officially dispatched." });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ISSUED");
  });
});
