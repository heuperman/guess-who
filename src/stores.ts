import { writable } from 'svelte/store';

export const storedCharacters = writable<(number[][])>([])
export const storedTarget = writable<(number[])>([])
export const storedIncorrectQuestions = writable<(number[][])>([[],[],[],[]])
export const storedCorrectQuestions = writable<(number[])>(new Array(4))
export const storedIncorrectGuesses = writable<(number[][])>([])
export const storedCorrectGuess = writable<(number[])>([])