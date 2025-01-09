import { TextAnimate, TextAnimateProps } from "./ui/text-animate"

export function TextSlideUpByLine(props: TextAnimateProps) {
  return <TextAnimate by="line" startOnView animation="slideUp" {...props}></TextAnimate>
}

export function TextSlideUpByWord(props: TextAnimateProps) {
  return <TextAnimate by="word" duration={0.2} startOnView animation="slideUp" {...props}></TextAnimate>
}

export function TextSlideUpByCharacter(props: TextAnimateProps) {
  return <TextAnimate by="character" startOnView animation="slideUp" {...props}></TextAnimate>
}

export function TextSlideUpByText(props: TextAnimateProps) {
  return <TextAnimate by="text" startOnView animation="slideUp" {...props}></TextAnimate>
}

export function TextFadeInByText(props: TextAnimateProps) {
  return <TextAnimate by="text" startOnView animation="fadeIn" {...props}></TextAnimate>
}
