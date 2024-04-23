import PrimaryProgramPageContent from './PrimaryProgramPageContent'
import SecondaryProgramContent from './SecondaryProgramPageContent'

const ProgramPageContent: React.FC<{ variant: string }> = ({ variant }) => {
  switch (variant) {
    case 'primary':
      return <PrimaryProgramPageContent />
    case 'secondary':
      return <SecondaryProgramContent />
    default:
      return <PrimaryProgramPageContent />
  }
}

export default ProgramPageContent
