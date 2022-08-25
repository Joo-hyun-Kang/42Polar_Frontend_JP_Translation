import { makeObservable, observable, action } from 'mobx';
import { axiosInstance } from '../../context/axios-interface';
import LoadingStore from '../loading/LoadingStore';

export class Keyword {
  keyword: string;

  constructor(keyword: string) {
    makeObservable(this, {
      keyword: observable,
    });
    this.keyword = keyword;
  }
}

class KeywordStore {
  keywords: Keyword[];
  selected: string[];

  constructor() {
    makeObservable(this, {
      keywords: observable,
      selected: observable,
      pushSelected: action,
      removeSelectedByKeyword: action,
      seletedClear: action,
      clear: action,
    });
    this.keywords = [];
    this.selected = [];
  }

  pushSelected(keyword: string) {
    this.selected.push(keyword);
  }

  removeSelectedByKeyword(keyword: string) {
    const idx = this.selected.indexOf(keyword);
    if (idx !== -1) {
      this.selected.splice(idx, 1);
    }
  }

  seletedClear() {
    this.selected = [];
  }

  clear() {
    this.keywords = [];
  }

  async Initializer(category: string) {
    LoadingStore.on();
    await axiosInstance
      .get(`/categories/${category}/keywords`)
      .then(res =>
        res?.data?.map((e: string) => {
          this.keywords.push(new Keyword(e));
        }),
      )
      .catch(err => {
        alert(`${err?.response?.data?.message}`);
      });
    LoadingStore.off();
  }
}

export default new KeywordStore();