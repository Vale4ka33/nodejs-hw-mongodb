import createHttpError from 'http-errors';
import fs from 'node:fs/promises';
import path from 'node:path';

import { deleteContactById, getAllContacts, getContactById, postContact, updateContactById } from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import mongoose from 'mongoose';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const getAllContactsController = async (req, res, next) => {
  try {
      const { page, perPage } = parsePaginationParams(req.query);
      const { sortBy, sortOrder } = parseSortParams(req.query);
      const filter = parseFilterParams(req.query);
      const userId = req.user._id;

      const result = await getAllContacts({
          page,
          perPage,
          sortBy,
          sortOrder,
          filter,
          userId
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
    const contactId = req.params.id;
    const userId = req.user._id; 
    const contact = await getContactById(contactId, userId);


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
    let photo = null;
    if(req.file){
      if(process.env.ENABLE_CLOUDINARY === 'true'){
        const result = await uploadToCloudinary(req.file.path);
        photo = result.secure_url;
      } else{
        await fs.rename(req.file.path, path.resolve('src', 'public/avatars', req.file.filename));
      photo = `http://localhost:3000/avatars/${req.file.filename}`;
      }
    }

    
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const userId = req.user._id;
    if (!name || !phoneNumber || !contactType) {
        throw createHttpError(400, 'Name, phoneNumber, and contactType are required');
    }

    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, 'Invalid userId');
  }

  const newContact = await postContact(
      { name, phoneNumber, email, isFavourite, contactType, userId, photo }
  );

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: newContact,
    });
};

export const updateContactController = async (req, res, next) => {
  const { id: contactId } = req.params;
  const updateData = req.body;
  const userId = req.user._id;
  const photo = req.file; 

  let photoUrl;

  if (photo) {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      photoUrl = await uploadToCloudinary(photo.path);
    } else {
      
      const filePath = `src/public/avatars/${photo.filename}`; 
      photoUrl = `/public/avatars/${photo.filename}`; 

      await fs.copyFile(photo.path, filePath); 
      await fs.unlink(photo.path); 
    }
  }

  const updatedContact = await updateContactById(contactId, {
    ...updateData,
    photo: photoUrl,
    userId, 
    
  });

  if (!updatedContact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated a contact!',
    data: updatedContact,
  });
};


export const deleteContactController = async (req, res, next) => {
  const { id: contactId } = req.params; 
  const userId = req.user._id;

  const deletedContact = await deleteContactById(contactId, userId);

  if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
  }

  res.sendStatus(204);
};