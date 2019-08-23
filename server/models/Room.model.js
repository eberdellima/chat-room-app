module.exports = (odm) => {

    let model = odm.models.Room

    if (!model) {
        const schema = new odm.Schema({
            id: { type: Number, required: true},
            members: { type: [String], required: true}
        })

        model = odm.model('Room', schema)
    }

    return model
}