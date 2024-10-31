import { FragmentType, useFragment } from '../../graphql/fragment-masking'
import { graphql } from '@/graphql'
import ParagraphElementComponent from '../elements/ParagraphElementComponent'
import BlogElementComponent from '../elements/BlogElementComponent'
import FooterElementComponent from '../elements/FooterElementComponent'
import HeaderElementComponent from '../elements/HeaderElementComponent'

export const CompositionElementNodeFragment = graphql(/* GraphQL */ `
    fragment compositionElementNode on CompositionElementNode {
    key
    element {
        ...blogElement
        ...paragraphElement
        ...headerElement
        ...footerElement
    }
    }
`)

const CompositionElementNodeComponent = (props: {
    compositionElementNode: FragmentType<typeof CompositionElementNodeFragment>
}) => {
    const compositionElementNode = useFragment(CompositionElementNodeFragment, props.compositionElementNode)
    const element = compositionElementNode.element
    switch (element?.__typename) {
        case "ParagraphElement":
            return <ParagraphElementComponent paragraphElement={element}/>
        case "BlogElement":
            return <BlogElementComponent blogElement={element}/>
        case "HeaderElement":
            return <HeaderElementComponent headerElement={element}/>
        case "FooterElement":
            return <FooterElementComponent footerElement={element}/>
        default:
            return <>NotImplementedException</>
    }
}

export default CompositionElementNodeComponent