import React from 'react'
import { Program, ProgramContentSectionType } from '../../types/program'
import EbookProgramPageContent from './Ebook/EbookProgramPageContent'
import PrimaryProgramPageContent from './Primary/PrimaryProgramPageContent'
import SecondaryProgramContent from './Secondary/SecondaryProgramPageContent'

class ProgramPageContentFactory {
  private readonly _type: string

  constructor(layoutTemplateVariant?: string | null) {
    this._type = layoutTemplateVariant || 'default'
  }

  public createContent(program: Program & ProgramContentSectionType): JSX.Element {
    const ContentComponent = this._getContentComponent()
    return <ContentComponent program={program} />
  }

  private _getContentComponent(): React.ComponentType<{ program: Program & ProgramContentSectionType }> {
    const contentMap: Record<string, React.ComponentType<{ program: Program & ProgramContentSectionType }>> = {
      ebook: EbookProgramPageContent,
      secondary: SecondaryProgramContent,
      default: PrimaryProgramPageContent,
    }
    return contentMap[this._type] || contentMap['default']
  }
}

const ProgramPageContent: React.FC<{
  layoutTemplateVariant: string | null | undefined
  program: Program & ProgramContentSectionType
}> = ({ layoutTemplateVariant, program }) => {
  const contentfactory = new ProgramPageContentFactory(layoutTemplateVariant)
  return contentfactory.createContent(program)
}

export default ProgramPageContent
