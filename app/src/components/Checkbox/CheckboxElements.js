import styled from 'styled-components/macro';

export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  // Hide checkbox visually but remain accessible to screen readers.
  // Source: https://polished.js.org/docs/#hidevisually
  border: 0;
  clip: rect(0 0 0 0);
  /* clippath: inset(50%); */
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`
export const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`

export const StyledCheckbox = styled.div`
  display: inline-block;
  width: 26px;
  height: 26px;
  background: ${props => props.checked ? 'salmon' : '#ffd48e'};
  border-radius: 3px;
  transition: all 150ms;

	 ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px pink;
  }
	${Icon} {
    visibility: ${props => props.checked ? 'visible' : 'hidden'}
  }
`
export const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`
export const CheckboxLabel = styled.label`
  display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 1em;
`
export const LabelText = styled.p`
  
`

