
module.exports = (odm) => {

    let model = odm.models.Message

    if(!model) {

        const schema = new odm.Schema({
            id: { type: Number, required: true },
            sender: { type: Number, required: true },
            sent_time: { type: Date, required: true },
            room_id: { type: Number, required: true },
            text: { type: String, required: true }
        })

        model = odm.model("Message", schema)
    }

    return model
}
