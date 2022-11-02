import { useState, useCallback , useEffect } from "react"
import words from "./wordList.json"
import { HangmanDrawing } from "./HangmanDrawing"
import { HangmanWord } from "./HangmanWord"
import { Keyboard } from "./Keyboard"

function getWord() {
  return words[Math.floor(Math.random() * words.length)]
}


function App() {
  const [wordtoGuess, setWordToGuess] = useState(getWord)

  const [geussedLetters, setGeussedLetters] = useState<string[]>([])

  const incorrectLetters = geussedLetters.filter(
    letter => !wordtoGuess.includes(letter)
  )

  const isLoser = incorrectLetters.length >= 6
  const isWinner = wordtoGuess
    .split("")
    .every(letter => geussedLetters.includes(letter))


  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (geussedLetters.includes(letter) || isLoser || isWinner) return

      setGeussedLetters(currentLetters => [...currentLetters, letter])
    },
    [geussedLetters, isWinner, isLoser]
  )


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (!key.match(/^[a-z]$/)) return

      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [geussedLetters])


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (key !== "Enter") return

      e.preventDefault()
      setGeussedLetters([])
      setWordToGuess(ge())
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [])

  return (
    <>
      <div style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center"
      }}>
        <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isWinner && "Winner! - Refresh to try again"}
        {isLoser && "Nice Try - Refresh to try again"}
        </div>
        <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
        <HangmanWord
        reveal={isLoser}
        guessedLetters={geussedLetters}
        wordToGuess={wordtoGuess}
      />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={geussedLetters.filter(letter =>
            wordtoGuess.includes(letter)
          )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
      </div>
    </>
  )
}

export default App
