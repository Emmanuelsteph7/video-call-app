// this is just a class for searching, filtering the database.
// it can be reused
class APIFeatures {
  constructor(query, queryString, categories) {
    this.query = query;
    this.queryString = queryString;
    this.categories = categories || [];
  }

  search() {
    // To use $regex, use one of the following syntaxes:
    // { <field>: { $regex: /pattern/, $options: '<options>' } }
    // { <field>: { $regex: 'pattern', $options: '<options>' } }
    // { <field>: { $regex: /pattern/<options> } }
    const filteredCategory = this.categories.find(
      (item) =>
        item.name.toLowerCase() === this.queryString.category.toLowerCase()
    );

    let category;

    if (filteredCategory) {
      category = this.queryString.category
        ? {
            // this will search the name field in our product database collection
            category: filteredCategory._id,
            // $regex: filteredCategory._id,
            // $options: "i", // i means case-insensitive
          }
        : {};
    } else {
      category = {};
    }

    this.query = this.query.find({ ...category });
    return this;
  }

  filter() {
    // a spread operator is used so that i can manipulate the objects in the queryString
    const copyQuery = { ...this.queryString };

    // this is to remove the keyword, limit and page fields from the queryString
    const removeFields = ["category"];
    // The delete operator removes a given property from an object. On successful deletion, it will return true, else false will be returned.
    removeFields.forEach((field) => delete copyQuery[field]);

    let queryStr = JSON.stringify(copyQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`); // gt, gte, lt, lte => greater than, greater than or equal to, less than, less than or equal to

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
