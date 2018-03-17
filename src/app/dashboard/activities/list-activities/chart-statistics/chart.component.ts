import 'rxjs/add/operator/switchMap';
import {
  Component, Inject, Input, OnChanges,
  OnInit, SimpleChange, ViewEncapsulation
} from '@angular/core';
import { APP_CONFIG }                       from '../../../../app.config';
import { ActivityService }                  from '../../../shared/activity.service';
import { Project }                          from 'app/shared/state/project/project.model';
import * as moment                          from 'moment';

declare const d3: any;

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass'],
  encapsulation: ViewEncapsulation.None
})

export class ChartComponent implements OnInit, OnChanges {
  @Input() project: Project;
  @Input() selectedUsers: string[];
  private toDate: Number;
  private fromDate: Number;
  private dateRange: any;
  dateString: string;
  calenderShow = false;

  multiLevelData = [];
  options;

  constructor (@Inject(APP_CONFIG) private config,
               private activityService: ActivityService) {
  }

  ngOnInit() {
    // configure date range for first api call
    this.fromDate = moment().subtract(7, 'days').endOf('day').valueOf();
    this.toDate = moment().startOf('day').valueOf();
    this.dateString = moment().subtract(7, 'days').format('MMM Do') + ' - ' + moment().format('MMM Do') ;

    // get data from server
    this.getStatAndPrepareData();

    // configure ng2-nvd3 chart
    this.options = {
      chart: {
        type: 'multiBarChart',
        height: 450,
        margin : {
          top: 60,
          right: 20,
          bottom: 30,
          left: 45
        },
        clipEdge: true,
        // staggerLabels: true,
        duration: 500,
        stacked: true,
        x: function(d){ return d.x; },
        y: function(d){ return d.y; },
        useInteractiveGuideline: true,
        showControls: false,
        xAxis: {
          showMaxMin: false
        },
        yAxis: {
          axisLabelDistance: 0,
          tickFormat: function(d){
            return d3.format('.02f')(d);
          }
        }
      }
    };
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes.selectedUsers && changes.selectedUsers.currentValue && !changes.selectedUsers.firstChange) {
      this.getStatAndPrepareData();
    }
  }

  getStatAndPrepareData() {
    this.multiLevelData = [];
    if (this.selectedUsers.length > 0) {
      this.activityService.getStat(this.project.id, this.selectedUsers, this.fromDate, this.toDate).then( (res) => {
        const temInputStatArray = res.result;
        temInputStatArray.map((data) => {
          const series = [];
          let userName = '';
          const user = this.project.teamMembers.filter(x => x.id === data._id)[0];

          if (user.name !== '') {
            userName = user.name;
          } else {
            userName = user.email;
          }
          data.stats.map((userStat, index) => {
            if (index === 0 && this.dateRange > 0 && this.dateRange < 4) {
              series.push({
                'x': ' ',
                'y': 0
              });
              series.push({
                'x': '  ',
                'y': 0
              })
            }
            let xAxisName =  moment(Number(userStat.id)).format('MMM Do');

            if (index + 2 <= data.stats.length) {
              xAxisName = xAxisName + '-' + moment(Number(data.stats[index + 1].id)).format('MMM Do');
            }
            const duration = moment.duration(userStat.value, 'ms').asHours();
            series.push({
              'x': xAxisName,
              'y': duration
            });
            if (index === data.stats.length -1 && this.dateRange > 0 && this.dateRange < 4) {
              series.push({
                'x': '   ',
                'y': 0
              });
              series.push({
                'x': '    ',
                'y': 0
              })
            }
          });

          this.multiLevelData.push({
            'key': userName,
            'values': series
            // color: ps-colors array
          });
        })
      });
    }
  }

  showCalender() {
    this.calenderShow = true;
  }

  closeCalender() {
    this.calenderShow = false;
  }

  updateDates(event) {
    this.dateString = event.start.format('MMM Do') + ' - ' + event.end.format('MMM Do');
    this.dateRange = moment.duration(Number(this.toDate) - Number(this.fromDate)).asDays();
    this.fromDate = event.start.startOf('day').valueOf();
    this.toDate = (event.end.add(1, 'days')).startOf('day').valueOf();
    this.getStatAndPrepareData();
    console.log('event', event)
    this.calenderShow = false;
  }
}


