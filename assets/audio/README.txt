Place your birthday background music in THIS folder (assets/audio/).

The website expects a single file named:

  happy-birthday.mp3

To use a different filename, update the <source> path inside
index.html in the <audio> tag (search for "birthday-audio").

The music starts automatically (with a gentle fade-in) after the
"Yes, It's Me" button is clicked on Page 1.

Note: Because of browser autoplay policies, music can only start
after a user interaction — which is why it begins on the button click.
If autoplay is still blocked, the script retries on the next click.
