import { SORT_ORDER } from "../constants/index.js";
import { ContactsCollection } from "../db/model/contact.js";

export const getAllContacts = async ({ 
    page = 1, 
    perPage = 10, 
    sortBy = 'name', 
    sortOrder = SORT_ORDER.ASC,
    filter = {}
}) => {
    const skip = page > 0 ? (page - 1) * perPage : 0;
    const sortOption = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const query = {};
    if (filter.contactType) {
        query.contactType = filter.contactType;
    }
    if (typeof filter.isFavourite === 'boolean') {
        query.isFavourite = filter.isFavourite;
    }

    const contactsQuery = ContactsCollection.find(query);
    
    const countQuery = ContactsCollection.countDocuments(query);

    const [contacts, count] = await Promise.all([
        contactsQuery.sort(sortOption).skip(skip).limit(perPage),
        countQuery,
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
