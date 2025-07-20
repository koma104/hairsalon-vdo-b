import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'

// ScrollTrigger、ScrollSmoother、SplitTextプラグインを登録
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)

export { gsap, ScrollTrigger, ScrollSmoother, SplitText } 