
const express = require("express")

const ProtectMiddleware = require("../app/Middleware/ProtectMiddleware.js")

const AuthController = require("../app/Controllers/AuthController.js")
const CategoryController = require("../app/Controllers/CategoryController.js")
const RecipeController = require("../app/Controllers/RecipeController.js")
const PortionController = require("../app/Controllers/PortionController.js");
const IngredientController = require("../app/Controllers/IngredientController.js");
const ProfileController = require("../app/Controllers/ProfileController.js")

const router = express.Router()

router.post("/auth/register", AuthController.register)
router.post("/auth/login", AuthController.login)

router.get("/profile", ProtectMiddleware, ProfileController.sendProfile)
router.get("/profile/recipes", ProtectMiddleware, RecipeController.sendOwnRecipes)
router.get("/:userId/avatar", ProtectMiddleware, ProfileController.sendAvatar)

router.get("/search/profile", ProtectMiddleware, ProfileController.sendProfiles)

router.get("/category", ProtectMiddleware, CategoryController.sendCategories)

router.post("/recipe/add", ProtectMiddleware, RecipeController.addRecipe)
router.get("/recipes", ProtectMiddleware, RecipeController.sendProfileRecipes)
//return recipe with portions and ingredients
router.get("/recipe/:userId/:recipeId", ProtectMiddleware, RecipeController.sendRecipe)

router.post("/portion/add", ProtectMiddleware, PortionController.addPortion)
router.get("/portions", ProtectMiddleware, PortionController.sendPortions)

router.post("/ingredient/add", ProtectMiddleware, IngredientController.addIngredient)
router.get("/ingredients", ProtectMiddleware, IngredientController.sendIngredients)
router.put("/ingredient/update", ProtectMiddleware, IngredientController.sendUpdate)




module.exports = router