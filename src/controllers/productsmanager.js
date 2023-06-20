import productModel from '../Dao/models/products.js'

class ProductManagerMongo {
    async getProducts(limit, page, sort, category, availability) {
      try {
        let result;
        let totalItems;
        const query = {};
  
        if (category) {
          query.category = category;
        }
  
        if (availability !== undefined) {
          query.status = availability;
        }
  
        if (limit > 0) {
          // Construir el objeto de opciones para la consulta
          const options = {};
  
          // Verificar si se especificó el ordenamiento
          if (sort) {
            options.sort = { price: sort === "asc" ? 1 : -1 };
          }
  
          // Obtener el número total de productos que coinciden con la consulta
          totalItems = await productModel.countDocuments(query);
  
          // Calcular el número total de páginas
          const totalPages = Math.ceil(totalItems / limit);
  
          // Calcular el índice de inicio
          const startIndex = (page - 1) * limit;
  
          // Obtener los productos que coinciden con la consulta, según el límite, el índice de inicio y las opciones de ordenamiento
          result = await productModel
            .find(query)
            .limit(limit)
            .skip(startIndex)
            .sort(options.sort);
        } else {
          result = await productModel.find(query);
          totalItems = result.length;
        }
  
        return {
          status: "success",
          payload: result,
          totalPages: Math.ceil(totalItems / limit),
          prevPage: page > 1 ? page - 1 : null,
          nextPage: page < Math.ceil(totalItems / limit) ? page + 1 : null,
          page: page,
          hasPrevPage: page > 1,
          hasNextPage: page < Math.ceil(totalItems / limit),
          prevLink: page > 1 ? `/products?limit=${limit}&page=${page - 1}&sort=${sort}&category=${category}&availability=${availability}` : null,
          nextLink: page < Math.ceil(totalItems / limit) ? `/products?limit=${limit}&page=${page + 1}&sort=${sort}&category=${category}&availability=${availability}` : null,
        };
      } catch (err) {
        console.log(err);
        throw new Error("An error occurred while fetching products.");
      }
    }
    async getProductById(id) {
        try {
          const product = await productModel.findById(id);
          return product;
        } catch (err) {
          throw err;
        }
      }
  }
  
  export default ProductManagerMongo;