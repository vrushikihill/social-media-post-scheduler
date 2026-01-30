import styled from '@emotion/styled'

const ColorStripeContainer = styled('div')(() => ({
  height: 22,
  width: '100%',
  border: '1px solid #b2b4b8',
  outline: '1px solid #b2b4b8',
  outlineOffset: 3.5,
  marginTop: 3.5,
  borderRadius: 1
}))

const VerticalStripeWrapper = styled('div')(() => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gridGap: '5px',
  flexDirection: 'row'
}))

const HorizontalStripeWrapper = styled('div')(() => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gridGap: '5px',
  flexDirection: 'colum'
}))

const VerticalStripe = styled('span')(() => ({
  height: '100%',
  width: '5px',
  display: 'inline-block'
}))

const HorizontalStripe = styled('span')(() => ({
  height: '3px',
  width: '100%',
  display: 'block'
}))

const Rank = ({ stripeDirection, stripeColor, color, width }) => {
  return (
    <ColorStripeContainer style={{ width }}>
      {stripeDirection === 'vertical' ? (
        <VerticalStripeWrapper style={{ background: color }}>
          <VerticalStripe style={{ background: stripeColor }} />
        </VerticalStripeWrapper>
      ) : (
        <HorizontalStripeWrapper style={{ background: color }}>
          <HorizontalStripe style={{ background: stripeColor }} />
        </HorizontalStripeWrapper>
      )}
    </ColorStripeContainer>
  )
}

export default Rank
