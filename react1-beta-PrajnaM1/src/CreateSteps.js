import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['STEP 1: Select Criteria', 'STEP 2: Add Courses', 'STEP 3: Cart'];
}

function getStepContent(stepIndex, props) {
  switch (stepIndex) {
    case 0:
      return <Sidebar setCourses={props.setCourses} courses={props.courses} subjects={props.subjects}/>;
    case 1:
      return <CourseArea data={props.data} allData={props.allData} cartMode={false} AddCourseToCart0={props.AddCourseToCart0} AddSectionToCart0={props.AddSectionToCart0} AddSubsectionToCart1={props.AddSubsectionToCart1} /> ;
    case 2:
      return <CourseArea data={props.dataCart} allData={props.allData} cartMode={true} RemoveCourseFromCart0={props.RemoveCourseFromCart0} RemoveSectionFromCart0={props.RemoveSectionFromCart0} RemoveSubsectionFromCart1={props.RemoveSubsectionFromCart1}/>;
    default:
      return 'Unknown stepIndex';
  }
}

export default function HorizontalLabelPositionBelowStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div style={{textAlign:"center"}}>
            <Button style={{alignItems:"center", border:"2px solid #4CAF50"}} onClick={handleReset}>Go Back to STEP 1</Button>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep, props)}
            <div style={{textAlign:"center"}}>
              <Button
                style={{alignItems:"center"}}
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button style={{alignItems:"center"}} variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
