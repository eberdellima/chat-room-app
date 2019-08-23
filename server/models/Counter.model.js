module.exports = (odm) => {

    let model = odm.models.Counter

    if(!model) {
        const schema = new odm.Schema({
            user_counter: { type: Number, required: true},
            message_counter: { type: Number, required: true},
            room_counter: { type: Number, required: true}
        })

        model = odm.model('Counter', Counter)
    }

    return model
}