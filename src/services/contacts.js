import { SORT_ORDER } from "../constants/index.js";
import { ContactsCollection } from "../db/model/contact.js";

export const getAllContacts = async ({ 
    page = 1, 
    perPage = 10, 
    sortBy = 'name', 
    sortOrder = SORT_ORDER.ASC,
    filter = {},
    userId
}) => {
    const skip = page > 0 ? (page - 1) * perPage : 0;
    const sortOption = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const query = { userId };
    if (filter.contactType) {
        query.contactType = filter.contactType;
    }
    if (typeof filter.isFavourite === 'boolean') {
        query.isFavourite = filter.isFavourite;
    }

    const contactsQuery = ContactsCollection.find(query);

    contactsQuery.where('userId').equals(userId);
    
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


export const getContactById = async (contactId, userId) => {
    const contact = await ContactsCollection.findOne({ _id: contactId, userId });
    if (!contact) {
        return null;
    }
    return contact;
};


export const postContact = async (newContact, userId) => {
    const contactWithUserId = { ...newContact, userId };
    return ContactsCollection.create(contactWithUserId);
};

export const updateContactById = async (contactId, updateData, userId) => {
    const updatedContact = await ContactsCollection.findOneAndUpdate(
        { _id: contactId, userId },
        updateData,
        { new: true }
    );
    
    return updatedContact;
};


export const deleteContactById = (contactId, userId) => ContactsCollection.findOneAndDelete({ _id: contactId, userId });
