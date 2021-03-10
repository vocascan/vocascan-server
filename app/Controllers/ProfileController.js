const { getJWT, getId } = require('../utils/index.js');
const {getProfiles, getUserProfile, getFollowerCount, getSubscriberCount, getRecipeCount, getAvatar} = require("../Services/ProfileServiceProvider.js")
const path = require('path');

async function sendProfiles(req, res) {

    //get fetch recipes from database
    const users = await getProfiles();

    res.send(users);
}

async function sendProfile(req, res) {

    //get JWT from request
    const token = getJWT(req, res);

    //parse id from request
    const userId = await getId(token);

    let response = {};
    const user = await getUserProfile(userId);
    response.name = user["name"];
    response.description = user["description"];

    response.followerCount = await getFollowerCount(userId);
    response.subscriberCount = await getSubscriberCount(userId);
    response.recipeCount = await getRecipeCount(userId);

    res.send(response)
}

async function sendAvatar(req, res) {
    //get userId from request
    const userId = req.params.userId;

    const [error, avatar] = await getAvatar(userId);

    //if no avatar was found standart image gets returned
    if (error) {
        return res.sendFile(path.join(__dirname, "../../user-unknown.png"))
    }

    res.writeHead(200, {
        'Content-Type': "image/png",
    });

    return avatar.pipe(res);
}

module.exports = {
    sendProfiles,
    sendProfile,
    sendAvatar
}