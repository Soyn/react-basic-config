#React-Bootstrap
## Button
    Button组件暴露给外面的是一个高阶组件，在react-bootstrap中暴露出来的组件都是包过之后的高阶组件，包裹的方式如下：
```javascript
    //ThemeProvider.js
    createBootstrapComponent(Component, opts) {
        if (typeof opts === 'string') opts = { prefix: opts };
        const isClassy = Component.prototype && Component.prototype.isReactComponent;
        // If it's a functional component make sure we don't break it with a ref
        const { prefix, forwardRefAs = isClassy ? 'ref' : 'innerRef' } = opts;

        return forwardRef(
            ({ ...props }, ref) => {
            props[forwardRefAs] = ref;
            return (
                <Consumer>
                {prefixes => (
                    <Component
                    {...props}
                    bsPrefix={props.bsPrefix || prefixes.get(prefix) || prefix}
                    />
                )}
                </Consumer>
            );
            },
            { displayName: `Bootstrap(${Component.displayName || Component.name})` },
        );
    }
```
    如上面所示的代码就是高阶组件的包裹函数，在这里需要使用forwardRef这个东西，主要用途就是挂ref，因为我们需要将ref挂到底层的组件，如果直接在返回的组件上挂ref的话，挂的ref不是底层的组件，而是外面那层，所以叫做forwardRef意思就是这个API就是将ref转发给别人；这里的`Cosumer`是订阅context的组件，在react-bootstrap中所有的组件都订阅了`ThemeProvider`，`ThemeProvider`的代码如下：

```javascript
    //ThemeProvider.js
    const { Provider, Consumer } = React.createContext(new Map());

    class ThemeProvider extends React.Component {
        static propTypes = {
            prefixes: PropTypes.object.isRequired,
        };

        constructor(...args) {
            super(...args);
            this.prefixes = new Map();
            Object.keys(this.props.prefixes).forEach(key => {
                this.prefixes.set(key, this.props.prefixes[key]);
            });
        }

        render() {
            return <Provider value={this.prefixes}>{this.props.children}</Provider>;
        }
    }
```

    如上的代码，如果我们需要整体替换theme的时候，传入不同的prefixes，然后就会替换掉对应的class，不同的class就应用上去了。

上面封装的两个方法，是react-bootstrap创建组件都会调用的方法，给外界暴露的组件都是被包过之后的高阶组件，对于这种需要跨组件的东西，比如theme、locale，包在context是不错的做法，给provider提供共享的值，需要这些值的组件，在外面包对应的`Consumer`。

## Alert
    `Alert`组件中的实现值得注意的一点就是uncontrollable组件的应用：
```javascript
    // Alert.js
    const DecoratedAlert = uncontrollable(
        createBootstrapComponent(Alert, 'alert'),
        {
            show: 'onClose',
        },
    );
```
    这里面的`uncontrollable`的也是一个高阶组件的调用，想象一下在有这样一个组件，如下：
```javascript
    // https://github.com/jquense/uncontrollable
    class SimpleDropdown extends React.Component {
        static propTypes = {
            value: React.PropTypes.string,
            onChange: React.PropTypes.func,
            open: React.PropTypes.bool,
            onToggle: React.PropTypes.func,
        }

        render() {
            return (
            <div>
                <input
                value={this.props.value}
                onChange={e => this.props.onChange(e.target.value)}
                />
                <button onClick={e => this.props.onToggle(!this.props.open)}>
                open
                </button>
                {this.props.open && (
                <ul className="open">
                    <li>option 1</li>
                    <li>option 2</li>
                </ul>
                )}
            </div>
            )
        }
    }
```
    上面的组件中是一个受控的组件，里面有一个`input`和`Dropdown`的组件，在使用这个组件的时候，需要将所有的props给这个组件消费，这是一个无状态的组件，如果我仅仅需要让input框成为受控，dropdownmenu成为一个不受控组件，那么用`uncontrollable`包装一下就可以满足这种需求:
```javascript
  const uncontrollable =  require('uncontrollable');

  const UncontrollableDropdown = uncontrollable(SimpleDropdown, {
    value: 'onChange',
    open: 'onToggle'
  })

  <UncontrollableDropdown
    value={this.state.val} // we can still control these props if we want
    onChange={val => this.setState({ val })}
    defaultOpen={true} /> // or just let the UncontrollableDropdown handle it
                          // and we just set an initial value (or leave it out completely)!
```
    这里返回了一个unControl的Component，这个返回的component其实是一个UncontrollableDropdown，也就是不受外面传的值影响，一直保持着'open'为true。

    在Alert的使用中我们仅仅想控制`Alert`的show的props，剩下的React-Bootstrap在Alert的scope下挂了另外两个组件：
```javascript
    // Alert.js
    const DivStyledAsH4 = divWithClassName('h4');

    DecoratedAlert.Link = createWithBsPrefix('alert-link', {
        Component: SafeAnchor,
    });

    DecoratedAlert.Heading = createWithBsPrefix('alert-heading', {
        Component: DivStyledAsH4,
    });


```

```javascript
    // Alert.js
    export default function createWithBsPrefix(
    prefix,
    { displayName = pascalCase(prefix), Component = 'div', defaultProps } = {},
    ) {
    return createBootstrapComponent(
        class extends React.Component {
        static displayName = displayName;

        static propTypes = { bsPrefix: () => {}, as: () => {} };

        render() {
            const {
            className,
            bsPrefix,
            as: Tag = Component,
            ...props
            } = this.props;

            return (
            <Tag
                {...defaultProps}
                {...props}
                className={classNames(className, bsPrefix)}
            />
            );
        }
        },
        prefix,
    );
    }
```
    如上是`createWithBsPrefix`的实现，这里就是一个高阶组件的调用，返回一个带`alert-*`的class

```javascript
    // Breadcrumbitem.js
```

