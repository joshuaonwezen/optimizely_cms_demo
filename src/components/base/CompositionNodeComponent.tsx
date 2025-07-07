import { FragmentType, useFragment } from '../../graphql/fragment-masking'
import { graphql } from '@/graphql'
// import ParagraphElementComponent from '../elements/ParagraphElementComponent'
import CityElementComponent from '../elements/CityElementComponent'
import HeroBanner from '../elements/HeroBanner'
import NoSearchResults from '../elements/NoSearchResultsComponent'
// import FooterElementComponent from '../elements/FooterElementComponent'
// import HeaderElementComponent from '../elements/HeaderElementComponent'


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
            return <CityElementComponent cityElement={component}/>
        case "HeroBanner":
            return <HeroBanner heroBanner={component}/>
        // case "FooterElement":
        //     return <FooterElementComponent footerElement={element}/>
        default:
            return <>NotImplementedException</>
    }
}

export default CompositionComponentNodeComponent