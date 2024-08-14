import { ContactsCollection } from "../db/model/contact.js";

export const getAllContacts = async ({ page, perPage, sortBy, sortOrder }) => {
    const skip = page > 0 ? (page - 1) * perPage : 0;

    const sortOption = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [contacts, count] = await Promise.all([
        ContactsCollection.find().sort(sortOption).skip(skip).limit(perPage),
        ContactsCollection.countDocuments(),
    ]);

    const totalPages = Math.ceil(count / perPage);

    return {
        contacts,
        page,
        perPage,
        totalItems: count,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
    };
};


export const getContactById = async (contactId) => {
    const contact = await ContactsCollection.findById(contactId);
    if (!contact) {
        return null;
    }
    return contact;
};

export const postContact = (newContact) => ContactsCollection.create(newContact);

export const updateContactById = async (contactId, updateData) => {
    const updatedContact = await ContactsCollection.findByIdAndUpdate(contactId, updateData, {
        new: true,
    });
    return updatedContact;
};

export const deleteContactById = (contactId) => ContactsCollection.findByIdAndDelete(contactId);
