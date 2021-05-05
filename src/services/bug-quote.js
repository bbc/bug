'use strict';

const logger = require('@utils/logger')(module);
const globalConfig = require('@models/global-config');

module.exports = async () => {

    let quotes = [
        "It's a buggy buggy day.",
        "Found any bugs in this software? Enjoy!",
        "You know what really bugs me? Bad puns.",
        "You know what, really bugs me? Bad. Punctuation.",
        "Why wouldn’t they let the butterfly into the dance? Because it was a mothball.",
        "Why did the fly never land on the computer? He was afraid of the world wide web.",
        "You win! No bad jokes or puns for you.",
        "What do you call a fly without wings? A walk.",
        "What do you call a rabbit with beetles all over it? Bugs Bunny.",
        "How do bees brush their hair? With a honey comb!",
        "How do bees get to school? On the school buzz! ",
        "Did you hear about the two bed bugs who met in the mattress? They got married in the spring ",
        "How do fireflies start a race? Ready, Set, Glow! ",
        "Where do most ants live? In Antlantic City! ",
        "How do fleas travel? They itch-hike! ",
        "What do you call a bug that can't have too much sugar? A diabeetle ",
        "What do moths study in school? Mothematics! ",
        "What do you do with a sick wasp? Take it to a waspital! ",
        "What did the sushi say to the bee? Wassabee! ",
        "What do ants use to smell good? Deodor-ant!",
        "What do you call a bug with four wheels and a trunk? A Volkswagen Beetle!",
        "What do you call a wasp? A wanna-bee!",
        "What do fireflies eat? Light snacks!",
        "What do you call two spiders who just got married? Newlywebs!",
        "What is a caterpillar scared of? A dogerpillar! ",
        "What kind of bugs live in clocks? Ticks! ",
        "What's a caterpillar's favorite weapon? A caterpolt!",
        "What is a bug's favorite sport? Cricket.",
        "Why was the grocery store out of butter? Because Butter flies.",
        "What do you call a musical insect? A humbug!",
        "What do you call a bee who's having a bad hair day? A frizz-bee!",
        "What bug is always running away from everything? A flea!"
    ];

    let random = quotes[Math.floor(Math.random()*quotes.length)]
    return random.trim();
}