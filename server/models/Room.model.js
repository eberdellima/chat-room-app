
module.exports = (odm) => {
    
    let model = odm.models.Room

    if(!model) {

        const ObjectId = odm.Types.ObjectId

        const schema = new odm.Schema({
            id: { type:  Number, required: true },
            participants: { type: [Number], required: true },
            created_by: { type: ObjectId, required: true, ref: "User"},
            created_at: { type: Date, required: true },
            updated_at: { type: Date, required: true },
            deleted_at: { type: Date }
        })

        model = odm.model("Room", schema)
    }

    return model
}