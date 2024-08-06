import { ContactsCollection } from "../db/model/contact.js";

export const getAllContacts = async () => {
    try {
        const contacts = await ContactsCollection.find();
        return contacts;
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw new Error('Failed to fetch contacts');
    }
};

export const getContactById = async (contactId) => {
    try {
        const contact = await ContactsCollection.findById(contactId);
        if (!contact) {
            return null;
        }
        return contact;
    } catch (error) {
        console.error('Failed to get contact:', error);
        throw new Error('Failed to get contact');
    }
};
