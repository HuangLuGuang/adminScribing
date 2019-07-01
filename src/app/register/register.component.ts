import { Component, OnInit } from '@angular/core';
import {ViewChild, Inject, PLATFORM_ID, ElementRef} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {fakeAsync} from '@angular/core/testing';
const headers = new HttpHeaders().set(
 "Content-type", "application/json"
).set("Authorization", 'Basic bWFibzptYWJv');

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    @ViewChild('cardId') cardId: ElementRef;
    public employeeInfo: any = {
      cardId: '',
      username: '',
      employeeNo: ''
    };
    public EmployeeInfoList = [];
    checkUserNameStr = '';
    checkCardIdStr = '';
    checkEmployeeNoStr = '';
    messages: string;
    displayP = false;
    deleteDisplayFlag = false;
    createEmployeeFlag = false;
    deleteEmployeeFlag = false;
    updateEmployeeFlag = false;
    queryEmployeeFlag = false;
    devices = ["Device01", "Device02", "Device03", "Device04", "Device05"];
    fileList: FileList;
    searchText = "";
    result: any;
    device_list: any;
    device_edit: any;
    gevent = null;
    uploadFlag = true;
    editFlag = false;
    updateDeviceConfigFlag = false;
    // 将提示框封装成一个方法，以便重用
    showDialog(string) {
      // 将参数赋给messages
      this.messages = string;
      // 提示框可见
      this.displayP = true;
      const that = this;
      setTimeout(function () {
          that.displayP = false;
      }, 2000);
    }
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private http: HttpClient) { }

  ngOnInit() {
  }
  displayCurrentPage(flag) {
    // params: query,create,updata,delete -->string
    this.createEmployeeFlag = false;
    this.deleteEmployeeFlag = false;
    this.updateEmployeeFlag = false;
    this.queryEmployeeFlag = false;
    this.updateDeviceConfigFlag = false;
    this.uploadFlag = false;
    switch (flag) {
      case 'create': this.createEmployeeFlag = true; break;
      case 'delete': this.deleteEmployeeFlag = true; break;
      case 'update': this.updateEmployeeFlag = true; break;
      case 'query': this.queryEmployeeFlag = true; break;
      case 'upload': this.uploadFlag = true; break;
      case 'updateDevice': this.updateDeviceConfigFlag = true; break;
    }
  }
  checkCardId(event) {
      const str = event.target.value;
      if (str.length === 0 ) {
        this.setFoucus();
        // this.checkCardIdStr = '请点击刷卡输入框,重新刷卡';
      } else {
        this.checkCardIdStr = '';
      }
  }
  checkUsername(event) {
      const str = event.target.value;
      if (str.length === 0 ) {
        this.checkUserNameStr = '请输入姓名';
      } else {
        this.checkUserNameStr = '';
      }
  }
  checkEmployeeNo(event) {
      const str = event.target.value;
      if (str.length === 0 ) {
        this.checkEmployeeNoStr = '请输入编号';
      } else {
        this.checkUserNameStr = '';
      }
  }
  cancleEnter(event) {
      if (event.target.value === 13) {
        return false;
      }
  }
  getCardId(event) {
    const cardId = event.target.value;
    if (cardId.length === 10) {
      this.showDialog("刷卡成功");
      return ;
    } else {
      this.showDialog("刷卡失败");
      return ;
    }
    console.log(cardId);
  }
  // 页面加载完毕获取输入框焦点
  setFoucus() {
    if (isPlatformBrowser(this.platformId)) {
      this.cardId.nativeElement.focus();
    }
  }
  createEmployee() {
      this.displayCurrentPage('create');
      setTimeout(handler => {
        this.setFoucus();
      }, 1000);
      this.setFoucus();
      // setInterval(() => {
      //   this.setFoucus();
      // }, 1000);
  }
  queryEmployee() {
      this.displayCurrentPage('query');
      this.httpQueryEmployee();
  }
  updateEmployee(employee = {}) {
      this.displayCurrentPage('update');
      try {
        this.employeeInfo.username = employee['NAME'];
        this.employeeInfo.employeeNo = employee['EMPLOYEENO'];
        this.employeeInfo.cardId = '';
      } catch (e) {
        console.log(e);
      }
      setTimeout(handler => {
        this.setFoucus();
      }, 800);
      setInterval(() => {
        // this.setFoucus();
      }, 1000);
      console.log(employee);
  }
  deleteEmployee(employee) {
      this.deleteDisplayFlag = true;
      console.log(employee);
  }
  sureDelete() {
      this.httpDeleteEmployee(this.employeeInfo.employeeNo);
      this.deleteDisplayFlag = false;
  }
  cancleDelete() {
      this.deleteDisplayFlag = false;
  }
  createCommit() {
      console.log(this.checkCardIdStr, this.checkEmployeeNoStr, 'test');
      if (this.checkCardIdStr === undefined || this.checkCardIdStr.length !== 0 ||
        // this.checkUserNameStr === undefined || this.checkUserNameStr.length === 0 ||
        this.checkEmployeeNoStr === undefined || this.checkEmployeeNoStr.length !== 0) {
        this.showDialog('请检查输入内容');
        return ;
      }
      this.httpCreateEmployee(this.employeeInfo);
      console.log(this.employeeInfo);
  }
  updateCommit() {
      console.log(this.checkCardIdStr, this.checkEmployeeNoStr, 'test');
      if (this.checkCardIdStr === undefined || this.checkCardIdStr.length !== 0 ||
        // this.checkUserNameStr === undefined || this.checkUserNameStr.length === 0 ||
        this.checkEmployeeNoStr === undefined || this.checkEmployeeNoStr.length !== 0) {
        this.showDialog('请检查输入内容');
        return ;
      }
      this.httpUpdateEmployee(this.employeeInfo);
      console.log(this.employeeInfo);
  }
  editBtn (event) {
    this.device_edit = event;
    if (this.device_edit.productno !== '') {
      this.editFlag = true;
      this.updateDeviceConfigFlag = false;
    }
    console.log(event);
  }
  editCommit() {
    this.editFlag = false;
    this.httpEdit();
    console.log(this.device_edit);
  }
  editCancle() {
    this.editFlag = false;
    this.displayCurrentPage('updateDevice');
  }
  selectFile(event) {
    console.log(event);
    this.fileList = event.target.files;
    this.gevent = event;
  }
  searchInput(event) {
    console.log(event.target.value);
    this.searchText = event.target.value;
  }
  // 取消上传
  cancleFile() {
    this.gevent.target.value = null;
  }
  uploadButton() {
    this.displayCurrentPage('upload');
    // this.updateDeviceConfigFlag = false;
    // this.uploadFlag = true;
  }

  productnoKeyup(event) {
      this.device_edit.productno = event.target.value;
  }
  oprsequencenoKeyup(event) {
      this.device_edit.oprsequenceno = event.target.value;
  }
  characteristicdescKeyup(event) {
      this.device_edit.characteristicdesc = event.target.value;
  }
  relationshipKeyup(event) {
      this.device_edit.relationship = event.target.value;
  }
  devicenoKeyup(event) {
      this.device_edit.deviceno = event.target.value;
  }
    searchBtn() {
      if (this.searchText === '') {
        this.showDialog("请输入物料号");
        return;
      }
      this.updateDeviceConfig(this.searchText);
    }
    uploadBtn(event) {
      if (this.gevent === null) {
        this.showDialog("请选择文件");
        return;
      }
      event.target.value = '上传中.....';
    }
    httpEdit() {
        this.http
      .post(
        '/api/sfproc',
        // TODO
        {
            "method": "update_device_list",
            "params": {"result": [this.device_edit]},
            "jsonrpc": "2.0",
            "id": "0"
        },
        {
          headers
        }
      ).subscribe(
        value => {
          this.result = value['result'];
          console.log(value, 'value');
          console.log(value);
          if (this.result !== ' ' && this.result !== null && this.result !== undefined && this.result.length !== 0 && this.result !== '') {
            if (this.result === '1') {
              this.showDialog('修改成功');
            } else {
              this.showDialog('修改失败');
            }
          }
          console.log(value);
        },
        error => {
          console.log('get order error');
        },
       () => {
         console.log('The Post observable is now completed.');
       }
      );
    }

  httpQueryEmployee() {
      this.http
      .post(
        '/api/sfproc',
        // TODO
        {
            "method": "get_employee",
            "params": {"result": ""},
            "jsonrpc": "2.0",
            "id": "1"
        },
        {
          headers
        }
      ).subscribe(
        value => {
          const result = value['result'];
          console.log(result, 'value');
          if (result.length !== 0) {
            this.EmployeeInfoList = result;
            console.log('if');
          }
          console.log(this.EmployeeInfoList, 'list');
        },
        error => {
          console.log('error');
        },
       () => {
         console.log('The Post observable is now completed.');
       }
      );
  }
  httpCreateEmployee(employee) {
      this.http
      .post(
        '/api/sfproc',
        // TODO
        {
            "method": "insert_employee",
            "params": {"result": {
                 "NAME": employee.username,
                 "EMPLOYEENO": employee.employeeNo,
                 "CARDNUMBER": employee.cardId

              }},
            "jsonrpc": "2.0",
            "id": "1"
        },
        {
          headers
        }
      ).subscribe(
        value => {
          const result = value['result'];
          console.log(value, 'value');
          console.log(value);
          if (result !== ' ' && result !== null && result !== undefined && result.length !== 0 && result !== '') {
            if (result === '1') {
              this.showDialog('添加成功');
              setTimeout(handler => {
                location.reload();
                }, 2000);
            } else if (result === '2') {
              this.showDialog('该用户已存在');
            } else {
              this.showDialog('添加失败，请检查输入');
            }
          }
          console.log(value);
        },
        error => {
          console.log('error');
        },
       () => {
         console.log('The Post observable is now completed.');
       }
      );
    }
  httpUpdateEmployee(employee) {
      this.http
      .post(
        '/api/sfproc',
        // TODO
        {
            "method": "update_employee",
            "params": {"result": {
                 "NAME": employee.username,
                 "EMPLOYEENO": employee.employeeNo,
                 "CARDNUMBER": employee.cardId

              }},
            "jsonrpc": "2.0",
            "id": "1"
        },
        {
          headers
        }
      ).subscribe(
        value => {
          const result = value['result'];
          console.log(value, 'value');
          console.log(value);
          if (result !== ' ' && result !== null && result !== undefined && result.length !== 0 && result !== '') {
            if (result === '1') {
              this.showDialog('修改成功');
                setTimeout(handler => {
                  location.reload();
                  }, 2000);
            } else if (result === '2') {
              this.showDialog('该用户未注册');
            } else {
              this.showDialog('修改失败，请重试');
            }
          }
          console.log(value);
        },
        error => {
          console.log('error');
        },
       () => {
         console.log('The Post observable is now completed.');
       }
      );
    }
  httpDeleteEmployee(employeeNo) {
      this.http
      .post(
        '/api/sfproc',
        // TODO
        {
            "method": "delete_employee",
            "params": {"result": employeeNo},
            "jsonrpc": "2.0",
            "id": "1"
        },
        {
          headers
        }
      ).subscribe(
        value => {
          const result = value['result'];
          console.log(value, 'value');
          console.log(value);
          if (result !== ' ' && result !== null && result !== undefined && result.length !== 0 && result !== '') {
            if (result === '1') {
              this.showDialog('删除成功');
            } else if (result === '2') {
              this.showDialog('该用户未注册');
            } else {
              this.showDialog('删除失败，请重试');
            }
          }
          console.log(value);
        },
        error => {
          console.log('error');
        },
       () => {
         console.log('The Post observable is now completed.');
       }
      );
    }
  // 获取设备配置
  updateDeviceConfig(productno) {
      this.displayCurrentPage('updateDevice');
      // this.updateDeviceConfigFlag = true;
      // this.uploadFlag = false;
        this.http
      .post(
        // '/api/getTest',
        '/api/sfproc',
        // TODO
        {
            "method": "get_device_list",
            "params": {"productno": productno},
            "jsonrpc": "2.0",
            "id": "0"
        },
        {
          headers
        }
      ).subscribe(
        value => {
          this.result = value['result'];
          console.log(value);
          console.log(this.result, '设备配置信息');
          if (this.result !== ' ' && this.result !== null && this.result !== undefined && this.result.length !== 0 && this.result !== '') {
            console.log(this.result, '判断之后的结果');
            this.device_list = this.result;
          }
          console.log(value);
        },
        error => {
          console.log('get order error');
        },
       () => {
         console.log('The Post observable is now completed.');
       }
      );
    }
}
