
module.exports = (odm) => {

    let model = odm.models.User

    if(!model) {

        const schema = new odm.Schema({
            id: { type: Number, required: true },
            username: { type: String, required: true },
            password: { type: String, required: true },
            icon: { type: String, required: true }
        })

        model = odm.model("User", schema)
    }

    return model
}