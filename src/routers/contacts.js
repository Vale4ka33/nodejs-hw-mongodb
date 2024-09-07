import { Router } from "express";
import { deleteContactController, getAllContactsController, getContactByIdController, postContactController, updateContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contact.js";
import { isValidId } from "../middlewares/isValidId.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

router.post("/", upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(postContactController));

router.patch('/:id', upload.single('photo'), isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactController));

router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default router;

