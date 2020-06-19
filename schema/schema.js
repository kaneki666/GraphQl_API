const graphql = require("graphql");
const ProductSchema = require("../models/Product");

const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = graphql;

const ProductImageType = new GraphQLObjectType({
  name: "ImageLink",
  fields: () => ({
    url: { type: GraphQLString },
  }),
});

const ProductImageTypeInput = new GraphQLInputObjectType({
  name: "ImageLinkInput",
  fields: () => ({
    url: { type: GraphQLString },
  }),
});

const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    name: { type: GraphQLString },
    price: { type: GraphQLString },
    productimages: { type: new GraphQLList(ProductImageType) },
    details: { type: GraphQLString },
    reviews: { type: GraphQLString },
    qty: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    products: {
      type: new GraphQLList(ProductType),
      args: { reviews: { type: GraphQLString } },
      resolve(parent, args) {
        return ProductSchema.find();
      },
    },
    product: {
      type: ProductType,
      args: { _id: { type: GraphQLString } },
      resolve(parent, args) {
        return ProductSchema.findOne({ _id: args._id });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addProduct: {
      type: ProductType,
      args: {
        name: { type: GraphQLString },
        price: { type: GraphQLString },
        productimages: { type: ProductImageTypeInput },
        details: { type: GraphQLString },
        reviews: { type: GraphQLString },
        qty: { type: GraphQLString },
      },
      resolve(parent, args) {
        let product = new ProductSchema({
          name: args.name,
          price: args.price,
          productimages: args.productimages,
          details: args.details,
          reviews: args.reviews,
          qty: args.qty,
        });
        return product.save();
      },
    },
    updateProduct: {
      type: ProductType,
      args: {
        _id: { type: GraphQLString },
        name: { type: GraphQLString },
        price: { type: GraphQLString },
        productimages: { type: ProductImageTypeInput },
        details: { type: GraphQLString },
        reviews: { type: GraphQLString },
        qty: { type: GraphQLString },
      },
      resolve(parent, args) {
        return ProductSchema.findOne({ _id: args._id }, (err, data) => {
          if (err) {
            return err;
          } else {
            let name = args.name,
              price = args.price,
              productimages = args.productimages,
              reviews = args.reviews,
              details = args.details;
            qty = args.qty;
            if (name == null || name == "") {
              name = data.name;
            }
            if (price == null || price == "") {
              price = data.price;
            }
            if (productimages == null || productimages == "") {
              productimages = data.productimages;
            }
            if (reviews == null || reviews == "") {
              reviews = data.reviews;
            }
            if (details == null || details == "") {
              details = data.details;
            }
            if (qty == null || qty == "") {
              qty = data.qty;
            }

            ProductSchema.findOneAndUpdate(
              { _id: args._id },
              {
                $set: {
                  name: name,
                  price: price,
                  productimages: productimages,
                  details: details,
                  reviews: reviews,
                  qty: qty,
                },
              },
              { new: true }
            ).exec((err, res) => {
              console.log("updated data", res);
              console.log("err", err);
            });
          }
        });
      },
    },
    deleteProduct: {
      type: ProductType,
      args: {
        _id: { type: GraphQLString },
      },
      resolve(parent, args) {
        return ProductSchema.findOneAndDelete({ _id: args._id });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
