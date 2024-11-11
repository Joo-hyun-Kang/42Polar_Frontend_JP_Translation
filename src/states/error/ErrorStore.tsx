import { action, makeObservable, observable } from 'mobx';

export const ERROR_DEFAULT_VALUE = {
  ERROR_MSG: '( エラー 発生 )',
  TITLE: '🚨 42Polar エラー',
};

class ErrorStore {
  isError: boolean;
  Title: string;
  errorMsg: string;

  constructor() {
    makeObservable(this, {
      isError: observable,
      errorMsg: observable,
      on: action,
      off: action,
    });
    this.isError = false;
    this.errorMsg = ERROR_DEFAULT_VALUE.ERROR_MSG;
    this.Title = ERROR_DEFAULT_VALUE.TITLE;
  }

  on(errorMsg: string, Title: string) {
    this.isError = true;
    if (errorMsg && errorMsg.length > 0) {
      this.errorMsg = errorMsg;
    }
    if (Title && Title.length > 0) {
      this.Title = Title;
    }
  }

  off() {
    this.isError = false;
    this.errorMsg = ERROR_DEFAULT_VALUE.ERROR_MSG;
    this.Title = ERROR_DEFAULT_VALUE.TITLE;
  }
}

export default new ErrorStore();
