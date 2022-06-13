import { addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import './preview.css'
import { Setup } from './Setup'

export const parameters = {
  layout: 'fullscreen',
}
addDecorator(withKnobs)
