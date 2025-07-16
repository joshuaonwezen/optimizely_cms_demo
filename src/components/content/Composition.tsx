import { FragmentType, useFragment } from '../../graphql/fragment-masking'
import { graphql } from '@/graphql'
import City from './City'
import Hero from './Hero'



export const CompositionComponentNodeFragment = graphql(/* GraphQL */ `
    fragment compositionComponentNode on CompositionComponentNode {
        key
        component {
            _metadata {
                types
            }
            ...cityElement
            ...heroBanner
        }
    }
`)

const CompositionComponentNodeComponent = (props: {
    compositionComponentNode: FragmentType<typeof CompositionComponentNodeFragment>
}) => {
    const compositionComponentNode = useFragment(CompositionComponentNodeFragment, props.compositionComponentNode)
    const component = compositionComponentNode.component ?? compositionComponentNode

    switch (component?.__typename) {
        case "CityBlock":
            return <City cityElement={component}/>
        case "HeroBanner":
            return <Hero heroBanner={component}/>
        // case "FooterElement":
        //     return <FooterElementComponent footerElement={element}/>
        default:
            return <>NotImplementedException</>
    }
}

export default CompositionComponentNodeComponent