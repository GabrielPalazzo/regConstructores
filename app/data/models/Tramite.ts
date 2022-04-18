import { Schema, model, Model, Document } from 'mongoose';

const TramiteSchema = new Schema(
  {
  name: {
    type: String,
    required: true
  }
});

const Tramite: Model<Document> = model('Tramite', TramiteSchema);
export default Tramite;
