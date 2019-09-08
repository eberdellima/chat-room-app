
module.exports = (odm) => {

    let model = odm.models.Counter

    if(!model) {

        const schema = new odm.Schema({
            name: { type: String, required: true },
            value: { type: Number, required: true }
        })

        model = odm.model("Counter", schema)
    }

    return model
}