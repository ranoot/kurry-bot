const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './databases/database.sqlite'
});

const Requests = sequelize.define('Request', {
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

const Responses = sequelize.define('Response', {
    chat_id: {
        type: DataTypes.NUMBER,
        unique: true,
        allowNull: false
    },
    trigger: {
        type: DataTypes.STRING,
        allowNull: false
    },
    response: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const addRequest = async(chat_id, gm_message) => {
    try {
        await Requests.sync();
        const duplicate = await Requests.findAll({ //checks whether req already exists
            'where': {'chat_id': chat_id}
        });
        if (duplicate.length === 0) {
            return await Requests.create({'chat_id': chat_id, 'gm_message': gm_message});
        } else {
            return false;
        }
    } catch (err) {
        console.error(err.message);
    }
}

const removeRequest = async(chat_id) => {
    try {
        await Requests.sync();
        await Requests.destroy({
            'where': {'chat_id': chat_id}
        });
        return true;
    } catch (err) {
        console.error(err.message);
        return false;
    }
};

const getRequests = async() => await Requests.findAll();

const getResponses = async(chat_id) => { // return falsy if no response found
    try {
        await Responses.sync();
        const resArray = await Responses.findAll({
            'where': {chat_id}
        });
        if (resArray.length >= 1) return resArray;
    } catch (err) {
        console.error(err);
    }
};

const addResponse = async(chat_id, trigger, response) => { // return falsy if no response added
    try {
        await Responses.sync();
        return await Responses.create({chat_id, trigger, response});
    } catch (err) {
        console.error(err);
    }
};

const removeResponse = async(chat_id, trigger) => { // return falsy if no rows deleted
    try {
        await Responses.sync();
        return await Responses.destroy({
            'where': {chat_id, trigger}
        });
    } catch (err) {
        console.error(err);
    }
};

export { Requests, addRequest, removeRequest, getRequests };
export { Responses, addResponse, removeResponse, getResponses };