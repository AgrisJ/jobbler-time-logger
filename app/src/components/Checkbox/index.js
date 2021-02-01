import React from 'react'
import { CheckboxContainer, HiddenCheckbox, StyledCheckbox, CheckboxLabel, LabelText, Icon } from './CheckboxElements'

const Checkbox = ({ className, checked, labelText, ...props }) => (
	<CheckboxLabel>
		<CheckboxContainer classNAme={className}>
			<HiddenCheckbox checked={checked} {...props} />
			<StyledCheckbox checked={checked}>
				<Icon viewBox="0 0 24 24">
					<polyline points="20 6 9 17 4 12" />
				</Icon>
			</StyledCheckbox>
		</CheckboxContainer>
		<LabelText>{labelText}</LabelText>
	</CheckboxLabel>
)

export default Checkbox
