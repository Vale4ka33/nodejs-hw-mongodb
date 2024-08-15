import createHttpError from 'http-errors';
import { deleteContactById, getAllContacts, getContactById, postContact, updateContactById } from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getAllContactsController = async (req, res, next) => {
  try {
      const { page, perPage } = parsePaginationParams(req.query);
      const { sortBy, sortOrder } = parseSortParams(req.query);
      const filter = parseFilterParams(req.query);

      const result = await getAllContacts({
          page,
          perPage,
          sortBy,
          sortOrder,
          filter
      });

      res.status(200).json({
          status: 200,
          message: "Successfully found contacts!",
          data: {
              data: result.contacts,
              page: result.page,
              perPage: result.perPage,
              totalItems: result.totalItems,
              totalPages: result.totalPages,
              hasPreviousPage: result.hasPreviousPage,
              hasNextPage: result.hasNextPage,
          },
      });
  } catch (error) {
      next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
    const contactId = req.params.contactId;
    const contact = await getContactById(contactId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  };

  export const postContactController = async (req, res, next) => {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  
    if (!name || !phoneNumber || !contactType) {
      throw createHttpError(400, 'Name, phoneNumber, and contactType are required');
    }
  
    const newContact = await postContact({ name, phoneNumber, email, isFavourite, contactType });
  
    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: newContact,
    });
  };

  export const updateContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const updateData = req.body;
  
    const updatedContact = await updateContactById(contactId, updateData);
  
    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }
  
    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  };

  export const deleteContactController = async(req, res, next) =>{
    const { contactId } = req.params;

    const deletedContact = await deleteContactById(contactId);

    if(!deletedContact){
      throw createHttpError(404, 'Contact not found');
    }

    res.sendStatus(204);
  };