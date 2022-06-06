const router = require('express').Router();

const {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

// /api/thoughts/
router.route('/')
    .get(getAllThoughts)

// api/thoughts/:userId
router.route('/:userId')
    .post(createThought)

router.route('/:thoughtId')
    .get(getThoughtById)
    .put(updateThought);

router
    .route('/:thoughtId/')
    .delete(deleteThought);

router.route('/:thoughtId/reactions')
    .post(createReaction);

router.route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);

module.exports = router;