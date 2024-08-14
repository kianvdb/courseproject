import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    duur: { type: String, required: true },
    kosten: { type: Number, required: true },
    moeilijkheid: { type: String, required: true },
    inleid: { type: String, required: true },
    ranking: { type: Number, required: true },
    mainPicture: { type: String },
    additionalPictures: [{ type: String }]
});

const Product = mongoose.model('Product', productSchema);

export default Product;
