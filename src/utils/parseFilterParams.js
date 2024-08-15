const parseContactType = (contactType) => {
    if (typeof contactType === 'string' && ['work', 'home', 'personal'].includes(contactType)) {
        return contactType;
    }
    return undefined;
};

const parseIsFavourite = (isFavourite) => {
    if (typeof isFavourite === 'string') {
        if (isFavourite.toLowerCase() === 'true') return true;
        if (isFavourite.toLowerCase() === 'false') return false;
    }
    return undefined;
};

export const parseFilterParams = (query) => {
    return {
        contactType: parseContactType(query.contactType),
        isFavourite: parseIsFavourite(query.isFavourite),
    };
};
