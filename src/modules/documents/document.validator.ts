import { body } from "express-validator";

export const createDocumentValidator = [
  body("title").isString().notEmpty().withMessage("Title is required."),
  body("serialNumber")
    .isString()
    .notEmpty()
    .withMessage("Serial number is required."),
  body("contentSummary")
    .isString()
    .notEmpty()
    .withMessage("Content summary is required."),
  body("type")
    .isIn(["INCOMING", "OUTGOING"])
    .withMessage("Invalid document type."),
];
