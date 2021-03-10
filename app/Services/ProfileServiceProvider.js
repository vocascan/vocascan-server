const { where } = require("sequelize");

//function to get all users
async function getProfiles() {
    const users = await db.users.findAll({
        attributes: ["id", "name"]
    })

    return users;
}

async function getUserProfile(userId) {
    const users = await db.users.find({
        attributes: ["name", "description"],
        where: {
            id: userId
        }
    })

    return users;
}

async function getFollowerCount(userId) {
    /*const count = await db.users.findAll({
        attributes: ["name", "description"]
    })*/

    return "0";
}

async function getSubscriberCount(userId) {
    return "0";
}

async function getRecipeCount(id) {
    const count = await db.recipes.count({
        where: {
            user_id: userId
        }
    })

    return count;
}

async function getAvatar(userId) {

    //fetch avatar from file storage
    try {
        const avatar = await fileStorage.getObject('users', userId);

        return [null, avatar];
    } catch (err) {
        // object not found
        if (err && err.code === 'NoSuchKey') {
            return [{error: "image not found"}];
        }

        // other errors
        return [{error: "internal server error"}];
    }
}

module.exports = {
    getProfiles,
    getUserProfile,
    getFollowerCount,
    getSubscriberCount,
    getRecipeCount,
    getAvatar
}