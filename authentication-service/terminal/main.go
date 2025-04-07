package main

import (
	"bufio"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"golang.org/x/term"
)

func main() {
	// Enter raw mode
	oldState, err := term.MakeRaw(int(os.Stdin.Fd()))
	if err != nil {
		panic(err)
	}
	defer term.Restore(int(os.Stdin.Fd()), oldState)

	fmt.Println("Welcome to Go Terminal!")
	fmt.Println("Press 'q' to exit.")

	// Capture Ctrl+C to exit gracefully
	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, os.Interrupt, syscall.SIGTERM)

	go func() {
		<-signalChan
		term.Restore(int(os.Stdin.Fd()), oldState)
		os.Exit(0)
	}()

	// Reading input from the terminal
	reader := bufio.NewReader(os.Stdin)
	for {
		input, _ := reader.ReadByte()
		if input == 'q' {
			fmt.Println("\nExiting...")
			break
		}
		fmt.Printf("%c", input)
	}
}
