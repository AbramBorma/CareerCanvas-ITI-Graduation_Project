import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import "../static/styles/timeline.css";

export default function HorizontalTimeline() {
  return (
    <div>
      <p className="process-header">
        Checkout Our Process Flow
      </p>

      <Timeline className='timeline' position="alternate">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color='error' />
            <TimelineConnector /> {/* Connector line restored */}
          </TimelineSeparator>
          <TimelineContent className="right-content">Create Account</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color='secondary' />
            <TimelineConnector /> {/* Connector line restored */}
          </TimelineSeparator>
          <TimelineContent className="left-content">Enroll in Track</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color='primary' />
            <TimelineConnector /> {/* Connector line restored */}
          </TimelineSeparator>
          <TimelineContent className="right-content">Take Exams</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color='success' />
          </TimelineSeparator>
          <TimelineContent className="left-content">Monitor Progress</TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  );
}
