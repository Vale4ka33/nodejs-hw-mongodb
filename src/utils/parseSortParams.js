import { SORT_ORDER } from "../constants/index.js";

const parseSortOrder = (sortOrder) => {
  if(typeof sortOrder !== 'string'){
    return SORT_ORDER.ASC;
  }
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  return isKnownOrder ? sortOrder : SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  if(typeof sortBy !== 'string'){
    return 'name';
  }
  const keysOfContact = ['_id', 'name', 'email', 'phoneNumber','contactType', 'createdAt'];

  if (keysOfContact.includes(sortBy)) {
    return sortBy;
  }

  return 'name';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
