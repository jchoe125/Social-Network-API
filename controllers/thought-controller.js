const { User, Thought } = require('../models');

const thoughtController = {

    //getting all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .then(thoughtData => res.json(thoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //getting one thought by ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
            .then(thoughtData => res.json(thoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    //creating new thought
    createThought({ params, body }, res) {
        // Get user from params
        User.findOne({ _id: params.userId })
            .then(userData => {
                thoughtBody = {
                    thoughtText: body.thoughtText,
                    username: userData.username
                }
                Thought.create(thoughtBody)
                    .then(({ _id }) => {
                        return User.findOneAndUpdate({ _id: params.userId }, { $push: { thoughts: _id } }, { new: true });
                    })
                    .then(thoughtData => {
                        if (!thoughtData) {
                            res.status(404).json({ message: 'Incorrect thought data!' });
                            return;
                        }
                        res.json(thoughtData);
                    })
                    .catch(err => res.json(err));
            })
            .catch(err => res.json(err));
    },

    //updating thought
    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, {
                thoughtText: req.body.thoughtText,
                username: req.body.username
            }, { new: true },
            (err, result) => {
                if (result) {
                    res.status(200).json(result);
                    console.log(`Updated: ${result}`);
                } else {
                    console.log(err);
                    res.status(500).json({ message: 'error', err });
                }
            }
        )
    },
    //deleting thought
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought ?
                res.status(404).json({ message: 'No thought with this id!' }) :
                User.findOneAndUpdate({ thoughts: req.params.thoughtId }, { $pull: { thoughts: req.params.thoughtId } }, { new: true })
            )
            .then((user) =>
                !user ?
                res.status(404).json({
                    message: 'Error deleting thought',
                }) :
                res.json({ message: 'Thought successfully deleted!' })
            )
            .catch((err) => res.status(500).json(err));
    },

    //creating new reaction
    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $push: { reactions: body } }, { new: true })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: "No thought with this id" });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.json(err));
    },
    //deleting reaction
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $pull: { reactions: { reactionId: params.reactionId } } }, { new: true })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    }
};

module.exports = thoughtController;