const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './databases/database.sqlite'
});

const Request = sequelize.define('Request', {
    chat_id: {
        type: DataTypes.NUMBER, 
        allowNull: false,
        unique: true
    },
    gm_message: {
        type: DataTypes.STRING, 
        defaultValue: 'gm'
    }
});

exports.Request = Request;

exports.addRequest = async(chat_id, gm_message) => {
    try {
        await Request.sync();
        const duplicate = await Request.findAll({ //checks whether req already exists
            'where': {'chat_id': chat_id}
        });
        if (duplicate.length === 0) {
            const reqInstance = await Request.create({'chat_id': chat_id, 'gm_message': gm_message});
            return reqInstance;
        } else {
            return false;
        }
    } catch (err) {
        console.error(err.message);
    }
}

exports.removeRequest = async(chat_id) => {
    try {
        await Request.sync();
        await Request.destroy({
            where: {'chat_id': chat_id}
        });
        return true;
    } catch (err) {
        console.error(err.message);
        return false;
    }
};

exports.getRequests = async() => await Request.findAll();