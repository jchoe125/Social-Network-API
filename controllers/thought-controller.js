const { User, Thought } = require('../models');

const thoughtController = {

    //getting all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .then(dbThoughtData = res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //getting one thought by ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thoughts found with that id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    //creating new thought
    createThought({ body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate({ _id: body.userId }, { new: true });
            })
            .then(dbUserData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No user found with that id' });
                    return;
                }
                res.json(dbThoughtData)
            })
            .catch(err => res.json(err));
    },
    //updating thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $push: { reactions: body } }, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with that id!' })
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thoughts found with that id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.json(400. json(err)));
    },


};