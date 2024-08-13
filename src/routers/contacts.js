import { Router } from "express";
import { deleteContactController, getAllContactsController, getContactByIdController, postContactController, updateContactController } from "../controllers/contscts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post("/", ctrlWrapper(postContactController));

router.patch('/:contactId',ctrlWrapper(updateContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

  export default router;
